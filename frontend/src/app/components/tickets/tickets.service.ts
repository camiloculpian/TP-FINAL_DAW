import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, catchError, debounceTime, delay, map, Observable, of, Subject, switchMap, tap } from "rxjs";
import { Directive, EventEmitter, Injectable, Input, Output, } from "@angular/core";
import { Response } from "../../dto/responses";
import { Ticket } from "../../dto/ticket";
import { environment } from "../../../environment/environment";

export type SortColumn = keyof Ticket | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}

@Directive({
	selector: 'th[sortable]',
	standalone: true,
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()',
	},
})

export class NgbdSortableHeader {
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(tickets: Ticket[], column: SortColumn, direction: string): Ticket[] {
	if (direction === '' || column === '') {
		return tickets;
	} else {
		return [...tickets].sort((a, b) => {
			const res = compare(a[column], b[column]);
			return direction === 'asc' ? res : -res;
		});
	}
}

function matches(ticket: Ticket, term: string) {
	return (
		ticket.title.toLowerCase().includes(term.toLowerCase()) ||
		String(ticket.id).includes(term) ||
		ticket.asignedToUser?.username.includes(term)
	);
}

// Servicio de Tickets
@Injectable({
    providedIn: 'root'
})
export class TicketService {
    // FOR SORTING
    private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _tickets$ = new BehaviorSubject<Ticket[]>([]);
	private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
		page: 1,
		pageSize: 4,
		searchTerm: '',
		sortColumn: '',
		sortDirection: '',
	};

    private apiUrl = environment.apiUrl;
    // private apiUrl = 'http://localhost:3000/api/v1';

    constructor(
        private http: HttpClient,
		// private pipe: DecimalPipe
    ) {
        this._search$
			.pipe(
				tap(() => this._loading$.next(true)),
				debounceTime(200),
				switchMap(() => this._search()),
				delay(200),
				tap(() => this._loading$.next(false)),
			)
			.subscribe((resp) => {
				this._tickets$.next(resp.data);
				this._total$.next(resp.data?.length);
			});
		this._search$.next();
		console.log(this._tickets$);
     }

    getTickets(): Observable<Response> {
        return this.http.get<any>(this.apiUrl+'/tickets');
    }

    getTicket(ticketId:number): Observable<any> {
        return this.http.get<any>(this.apiUrl+`/tickets/${ticketId}`);
    }

    updateTicket(ticketId:number, ticket: Ticket){
        return this.http.patch<any>(this.apiUrl+`/tickets/${ticketId}`, ticket);
    }

    addTicket(ticket: Ticket): Observable<any> {
        return this.http.post<any>(this.apiUrl+'/tickets', ticket);
    }

    deleteTicket(ticketId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/tickets/${ticketId}`);
    }

    // FOR SORTING
    get tickets$() {
		return this._tickets$.asObservable();
	}
	get total$() {
		return this._total$.asObservable();
	}
	get loading$() {
		return this._loading$.asObservable();
	}
	get page() {
		return this._state.page;
	}
	get pageSize() {
		return this._state.pageSize;
	}
	get searchTerm() {
		return this._state.searchTerm;
	}

	set page(page: number) {
		this._set({ page });
	}
	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}
	set searchTerm(searchTerm: string) {
		this._set({ searchTerm });
	}
	set sortColumn(sortColumn: SortColumn) {
		this._set({ sortColumn });
	}
	set sortDirection(sortDirection: SortDirection) {
		this._set({ sortDirection });
	}

	private _set(patch: Partial<State>) {
		Object.assign(this._state, patch);
		this._search$.next();
	}

	// private _search(): Observable<SearchResult> {
	private _search(): Observable<Response> {
		const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;
		const params = new HttpParams().set('filter', this.searchTerm);

		return this.http.get<Response>(this.apiUrl+'/tickets',{params: params}).pipe(
			map((resp) => {
			   //You can perform some transformation here
			   
			   // 1. sort
			   let tickets = sort(resp.data, sortColumn, sortDirection);

			   // 2. paginate
			   tickets = tickets.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

			   return resp;
			}),
			catchError((err, caught) => {
			  console.error(err);
			  throw err;
			})
		)

	}
}
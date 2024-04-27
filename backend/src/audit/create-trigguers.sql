DROP TRIGGER trigger_ticket_update;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS trigger_ticket_update
AFTER UPDATE ON ticket
FOR EACH ROW
BEGIN
    INSERT INTO ticket_audit (
        ticketId,
        description,
        asignedToUserId,
        modifiedByUserId,
        priority,
        status,
        modifiedAt,
        operation
    )
    VALUES (
        NEW.id,
        NEW.description,
        NEW.asignedToUserId,
        NEW.lastModifiedByUserId,
        NEW.priority,
        NEW.status,
        CURRENT_DATE(),
        'UPDATE'
    );
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS trigger_ticket_create;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS trigger_ticket_create
AFTER INSERT ON ticket
FOR EACH ROW
BEGIN
    INSERT INTO ticket_audit (
        ticketId,
        description,
        asignedToUserId,
        modifiedByUserId,
        priority,
        status,
        modifiedAt,
        operation
    )
    VALUES (
        NEW.id,
        NEW.description,
        NEW.asignedToUserId,
        NEW.lastModifiedByUserId,
        NEW.priority,
        NEW.status,
        CURRENT_DATE(),
        'CREATE'
    );
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS trigger_ticket_delete;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS trigger_ticket_delete
AFTER DELETE ON ticket
FOR EACH ROW
BEGIN
    INSERT INTO ticket_audit (
        ticketId,
        description,
        asignedToUserId,
        modifiedByUserId,
        priority,
        status,
        modifiedAt,
        operation
    )
    VALUES (
        OLD.id,
        OLD.description,
        OLD.asignedToUserId,
        OLD.lastModifiedByUserId,
        OLD.priority,
        OLD.status,
        CURRENT_DATE(),
        'DELETE'
    );
END;
//
DELIMITER ;

--- Cuando se elimina un ticket deberia aparecer DELETE y aparece UPDATE ---
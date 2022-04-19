CREATE DATABASE DemoDB;
GO
USE DemoDB;
GO
CREATE TABLE Orders
(
    order_id nvarchar(50) NOT NULL PRIMARY KEY,
    description nvarchar(255),
    status nvarchar(50),
    email nvarchar(255),
    created DATETIME DEFAULT(getdate()),
);
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("01-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("01-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("01-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("02-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("02-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("02-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("03-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("03-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("03-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("04-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("04-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("04-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("05-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("05-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("05-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("06-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("06-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("06-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("07-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("07-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("07-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("08-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("08-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("08-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("09-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("09-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("09-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("11-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("11-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("11-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("12-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("12-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("12-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("13-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("13-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("13-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("14-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("14-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("14-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("15-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("15-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("15-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("16-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("16-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("16-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("17-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("17-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("17-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("18-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("18-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("18-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("19-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("19-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("19-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("20-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("20-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("20-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("21-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("21-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("21-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("22-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("22-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("22-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("23-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("23-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("23-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("24-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("24-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("24-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("25-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("25-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("25-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("26-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("26-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("26-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("27-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("27-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("27-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("28-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("28-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("28-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("29-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("29-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("29-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("30-10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("30-10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("30-10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
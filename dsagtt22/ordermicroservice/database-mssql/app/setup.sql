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
VALUES("10000001-01", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-01", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-01", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-02", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-02", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-02", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-03", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-03", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-03", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-04", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-04", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-04", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-05", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-05", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-05", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-06", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-06", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-06", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-07", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-07", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-07", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-08", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-08", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-08", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-09", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-09", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-09", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-10", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-10", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-10", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-11", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-11", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-11", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-12", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-12", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-12", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-13", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-13", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-13", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-14", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-14", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-14", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-15", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-15", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-15", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-16", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-16", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-16", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-17", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-17", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-17", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-18", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-18", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-18", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-19", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-19", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-19", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-20", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-20", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-20", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-21", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-21", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-21", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-22", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-22", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-22", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-23", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-23", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-23", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-24", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-24", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-24", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-25", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-25", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-25", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-26", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-26", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-26", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-27", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-27", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-27", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-28", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-28", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-28", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-29", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-29", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-29", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001-30", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002-30", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003-30", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
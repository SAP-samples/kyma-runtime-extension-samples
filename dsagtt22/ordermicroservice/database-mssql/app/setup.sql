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
VALUES("01-10000001", "Sample Order 1 (user 01)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("01-10000002", "Sample Order 2 (user 01)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("01-10000003", "Sample Order 3 (user 01)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("02-10000001", "Sample Order 1 (user 02)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("02-10000002", "Sample Order 2 (user 02)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("02-10000003", "Sample Order 3 (user 02)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("03-10000001", "Sample Order 1 (user 03)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("03-10000002", "Sample Order 2 (user 03)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("03-10000003", "Sample Order 3 (user 03)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("04-10000001", "Sample Order 1 (user 04)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("04-10000002", "Sample Order 2 (user 04)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("04-10000003", "Sample Order 3 (user 04)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("05-10000001", "Sample Order 1 (user 05)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("05-10000002", "Sample Order 2 (user 05)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("05-10000003", "Sample Order 3 (user 05)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("06-10000001", "Sample Order 1 (user 06)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("06-10000002", "Sample Order 2 (user 06)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("06-10000003", "Sample Order 3 (user 06)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("07-10000001", "Sample Order 1 (user 07)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("07-10000002", "Sample Order 2 (user 07)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("07-10000003", "Sample Order 3 (user 07)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("08-10000001", "Sample Order 1 (user 08)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("08-10000002", "Sample Order 2 (user 08)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("08-10000003", "Sample Order 3 (user 08)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("09-10000001", "Sample Order 1 (user 09)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("09-10000002", "Sample Order 2 (user 09)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("09-10000003", "Sample Order 3 (user 09)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10-10000001", "Sample Order 1 (user 10)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10-10000002", "Sample Order 2 (user 10)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10-10000003", "Sample Order 3 (user 10)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("11-10000001", "Sample Order 1 (user 11)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("11-10000002", "Sample Order 2 (user 11)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("11-10000003", "Sample Order 3 (user 11)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("12-10000001", "Sample Order 1 (user 12)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("12-10000002", "Sample Order 2 (user 12)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("12-10000003", "Sample Order 3 (user 12)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("13-10000001", "Sample Order 1 (user 13)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("13-10000002", "Sample Order 2 (user 13)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("13-10000003", "Sample Order 3 (user 13)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("14-10000001", "Sample Order 1 (user 14)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("14-10000002", "Sample Order 2 (user 14)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("14-10000003", "Sample Order 3 (user 14)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("15-10000001", "Sample Order 1 (user 15)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("15-10000002", "Sample Order 2 (user 15)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("15-10000003", "Sample Order 3 (user 15)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("16-10000001", "Sample Order 1 (user 16)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("16-10000002", "Sample Order 2 (user 16)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("16-10000003", "Sample Order 3 (user 16)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("17-10000001", "Sample Order 1 (user 17)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("17-10000002", "Sample Order 2 (user 17)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("17-10000003", "Sample Order 3 (user 17)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("18-10000001", "Sample Order 1 (user 18)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("18-10000002", "Sample Order 2 (user 18)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("18-10000003", "Sample Order 3 (user 18)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("19-10000001", "Sample Order 1 (user 19)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("19-10000002", "Sample Order 2 (user 19)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("19-10000003", "Sample Order 3 (user 19)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("20-10000001", "Sample Order 1 (user 20)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("20-10000002", "Sample Order 2 (user 20)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("20-10000003", "Sample Order 3 (user 20)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("21-10000001", "Sample Order 1 (user 21)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("21-10000002", "Sample Order 2 (user 21)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("21-10000003", "Sample Order 3 (user 21)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("22-10000001", "Sample Order 1 (user 22)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("22-10000002", "Sample Order 2 (user 22)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("22-10000003", "Sample Order 3 (user 22)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("23-10000001", "Sample Order 1 (user 23)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("23-10000002", "Sample Order 2 (user 23)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("23-10000003", "Sample Order 3 (user 23)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("24-10000001", "Sample Order 1 (user 24)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("24-10000002", "Sample Order 2 (user 24)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("24-10000003", "Sample Order 3 (user 24)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("25-10000001", "Sample Order 1 (user 25)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("25-10000002", "Sample Order 2 (user 25)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("25-10000003", "Sample Order 3 (user 25)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("26-10000001", "Sample Order 1 (user 26)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("26-10000002", "Sample Order 2 (user 26)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("26-10000003", "Sample Order 3 (user 26)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("27-10000001", "Sample Order 1 (user 27)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("27-10000002", "Sample Order 2 (user 27)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("27-10000003", "Sample Order 3 (user 27)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("28-10000001", "Sample Order 1 (user 28)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("28-10000002", "Sample Order 2 (user 28)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("28-10000003", "Sample Order 3 (user 28)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("29-10000001", "Sample Order 1 (user 29)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("29-10000002", "Sample Order 2 (user 29)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("29-10000003", "Sample Order 3 (user 29)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("30-10000001", "Sample Order 1 (user 30)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("30-10000002", "Sample Order 2 (user 30)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("30-10000003", "Sample Order 3 (user 30)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("31-10000001", "Sample Order 1 (user 31)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("31-10000002", "Sample Order 2 (user 31)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("31-10000003", "Sample Order 3 (user 31)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("32-10000001", "Sample Order 1 (user 32)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("32-10000002", "Sample Order 2 (user 32)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("32-10000003", "Sample Order 3 (user 32)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("33-10000001", "Sample Order 1 (user 33)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("33-10000002", "Sample Order 2 (user 33)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("33-10000003", "Sample Order 3 (user 33)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("34-10000001", "Sample Order 1 (user 34)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("34-10000002", "Sample Order 2 (user 34)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("34-10000003", "Sample Order 3 (user 34)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("35-10000001", "Sample Order 1 (user 35)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("35-10000002", "Sample Order 2 (user 35)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("35-10000003", "Sample Order 3 (user 35)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("36-10000001", "Sample Order 1 (user 36)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("36-10000002", "Sample Order 2 (user 36)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("36-10000003", "Sample Order 3 (user 36)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("37-10000001", "Sample Order 1 (user 37)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("37-10000002", "Sample Order 2 (user 37)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("37-10000003", "Sample Order 3 (user 37)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("38-10000001", "Sample Order 1 (user 38)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("38-10000002", "Sample Order 2 (user 38)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("38-10000003", "Sample Order 3 (user 38)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("39-10000001", "Sample Order 1 (user 39)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("39-10000002", "Sample Order 2 (user 39)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("39-10000003", "Sample Order 3 (user 39)", "created", "paulchen.panther@tester.com" )
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("40-10000001", "Sample Order 1 (user 40)", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("40-10000002", "Sample Order 2 (user 40)", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("40-10000003", "Sample Order 3 (user 40)", "created", "paulchen.panther@tester.com" )
GO
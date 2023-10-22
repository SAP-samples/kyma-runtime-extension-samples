CREATE DATABASE LionelFridgyDB;
GO
USE LionelFridgyDB;
GO
CREATE TABLE RawData
(
    closed DATETIME DEFAULT(getdate()) PRIMARY KEY, 
    floor11 int,
    floor12 int,
    floor21 int,
    floor22 int,
    floor31 int,
    floor32 int,
    floor41 int,
    floor42 int
);
GO
CREATE TABLE ComputationDataF
(
    closed VARCHAR(25) PRIMARY KEY, 
    floor1 int,
    floor2 int,
    floor3 int,
    floor4 int
);

CREATE DATABASE BotKnowledgeDB;
GO
USE BotKnowledgeDB;
GO
CREATE TABLE Questions
(
    id_num int IDENTITY(1,1) PRIMARY KEY, 
    stack_q_id nvarchar(50) NOT NULL,
    stack_q_ts nvarchar(50),
    stack_a_id nvarchar(50),
    stack_a_ts nvarchar(50),
    cai_q_id nvarchar(50),
    cai_a_id nvarchar(50),
    created DATETIME DEFAULT(getdate())
);
GO

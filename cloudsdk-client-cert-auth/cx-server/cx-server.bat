@ECHO OFF

ECHO Please note that Cx Server on Windows is for convenient development and evaluation.
ECHO For running an productive Cx Server, please use a Linux System.

IF "%~1"==backup GOTO NOT_SUPPORTED
IF "%~1"==restore GOTO NOT_SUPPORTED
IF "%~1"==update (
    IF "%~2"=="image" GOTO NOT_SUPPORTED
)

IF "%CD%"=="" GOTO WORKING_DIR_EMPTY

IF "%DEVELOPER_MODE%"=="" docker pull ppiper/cx-server-companion

(
    docker run --rm -it --workdir /cx-server/mount --volume //var/run/docker.sock:/var/run/docker.sock --mount source="%CD%",target=/cx-server/mount,type=bind --env DEVELOPER_MODE --env host_os=windows --env cx_server_path="%CD%" ppiper/cx-server-companion /cx-server/cx-server-companion.sh %~1 %~2
    IF NOT %ERRORLEVEL% == 0 GOTO RUN_ERROR
    GOTO END
)

:NOT_SUPPORTED
ECHO "backup", "restore" and "update image" are currently not supported on Windows.
GOTO END

:RUN_ERROR
ECHO Could not run the Cx Server Docker container.
ECHO Please ensure that docker is running (with "docker run hello-world")
ECHO Also, please make sure that the Windows drive where your project is located (usually C:) is shared with Docker as described in https://docs.docker.com/docker-for-windows/#shared-drives.
GOTO END

:WORKING_DIR_EMPTY
ECHO The environment variable CD is not set. It is required that this variable points to the directory where cx-server.bat resides.
GOTO END

:END
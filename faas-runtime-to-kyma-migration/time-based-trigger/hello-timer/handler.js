module.exports = {
    main: function (event, context) {
        const nowUTC = (new Date()).toISOString();
        console.log('run at', nowUTC);
        return nowUTC;
    }
}
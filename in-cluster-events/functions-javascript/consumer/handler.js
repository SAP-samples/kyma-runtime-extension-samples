module.exports = { 
    main: function (event, context) {
      console.log(`event data: ${event.data}`);
      console.log(`headers: ${JSON.stringify(event.extensions.request.headers)}`);
    }
  }
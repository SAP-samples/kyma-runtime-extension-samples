module.exports = { 
    main: function (event, context) {
      console.log(`event data: ${JSON.stringify(event.data)}`);
      console.log(`headers: ${JSON.stringify(event.extensions.request.headers)}`);
    }
  }
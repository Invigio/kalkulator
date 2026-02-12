module.exports = async function (context, req) {
  context.log('Health check triggered');

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Calculator API (Azure Functions)'
    }
  };
};

const firebase = require("../firebase");

// check if the token is present in the request
function authMiddleware(request, response, next) {
    const headerToken = request.headers.authorization;
    if (!headerToken) {
      return response.send({ message: "Authorization bearer not found" }).status(401);
    }
  
    if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
      response.send({ message: "Invalid Authorization Token" }).status(401);
    }
  
    const token = headerToken.split(" ")[1];
    firebase
      .auth()
      .verifyIdToken(token)
      .then((userObj) => {
        response.locals.user = userObj;
        next();
      })
      .catch(() => response.send({ message: "Forbidden Request" }).status(403));
  }
  
  module.exports = authMiddleware;

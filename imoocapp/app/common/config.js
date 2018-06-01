module.exports = {
  header: {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  },
  api: {
    base: "http://rapapi.org/mockjs/33727/",
    creations: "api/creations",
    up: "api/up",
    comment: "api/comment",
    signup: "api/u/signup",
    verify: "api/u/verify",
    signature:'api/signature'
  }
};

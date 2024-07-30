class Request {
    constructor(req , res) {
     this.parsedUrl = url.parse(req.url,true);
     this.path = parsedUrl.pathname;
     this.trimPath = path.replace(/^\/+|\/+$/g,'');
     this.method = req.method.toLowerCase();
     this.queryStringObject = parsedUrl.query;
     this.headerObject = req.headers;
    }

     request(){
       this.parsedUrl
    }
}
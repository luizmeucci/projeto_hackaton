//https://docs.aws.amazon.com/pt_br/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html

if (typeof define == 'function') {
    define(function (require) {
        require("js/vendor/aws/aws-sdk-2.283.1.min.js");
    });
}

window.S3 = (function () {
    var classe = function (_options)
    {
        this.options = _options;
        this.bucketName = "univirtus-auditoria";
        this.bucketRegion = "us-east-1";
        this.identityPoolId = "us-east-1:46c6cfed-d443-4b94-8c62-4de467d8b8d1";

        var Init = function () {
            if (this.options != void (0)) {
                this.bucketName = this.options.bucketName || this.bucketName;
                this.bucketRegion = this.options.bucketRegion || this.bucketRegion;
                this.identityPoolId = this.options.identityPoolId || this.identityPoolId;
            }
        };

        this.dataURItoBlob = function(dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        }

        this.SendFile = function(file, name, success, error)
        {
            var contentEncoding = void (0);
            var contentType = void(0);

            //Set credencials:
            AWS.config.update({
                region: this.bucketRegion,
                credentials: new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: this.identityPoolId
                })
            });

            if ((typeof file == 'string') && file.indexOf('base64') > -1) {

                file = this.dataURItoBlob(file);
                contentEncoding = 'base64';
                contentType = 'image/jpeg';
            }

            var upload = new AWS.S3.ManagedUpload({
                params: {
                    Key: name,
                    Body: file,
                    Bucket: this.bucketName,
                    ContentEncoding: contentEncoding,
                    ContentType: contentType,
                    ACL: "public-read"
                }
            });

            success = success || function (data) { console.log(data) };
            error = error || function (data) { console.log(data) };

            var promise = upload.promise();

            promise.then(success, error);
        }

        Init();

    };
    return classe;
})();
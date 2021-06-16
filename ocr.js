const http = require('http') 
const server = http.createServer()
const tesseract = require("node-tesseract-ocr")

server.on('request', function (request,response) {
	const { method, url } = request
	response.setHeader('Content-Type', 'application/json')
	response.setHeader('Access-Control-Allow-Origin', '*')
	response.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
	if(url == '/ocr') {
		if(method == 'POST') {
			let body = ''
			request.on('data', (chunk) => {
				body += chunk
			}).on('end', () => {
				let buff = Buffer.from(body, 'base64')
				tesseract
					.recognize(buff)
					.then((text) => {
						response.end(JSON.stringify({
							status: 'success',
							result: text,
						}))
					})
					.catch((error) => {
						response.end(JSON.stringify({
							status: 'fail',
						}))
						console.log(error.message)
					})
			})
		} else {
			response.end('request method wrong.')
		}
	} else if (url !== '/') {
		response.end('wrong path')
	} else {
		response.end('welcom to OCR services.')
	}
})
server.listen(3000)
console.log('OCR listening: http://localhost:3000/')
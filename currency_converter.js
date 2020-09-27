(function(){

const newCurrency = 'AUD', // e.g AED, USD, CAD, CHF 
	  duration = 10; // e.g 1, 10, 100


const currencyConverter = {

	init: function (argument) {
		const _$ = this;
		
		_$.mainCss();
		_$.buildDiv();
		_$.bindEvents();
		_$.sendHttpRequest();
		_$.globalVar();


	}, 

	mainCss: function(){
		var mainCss = ''+
                'html, body { height: 100%; } body { margin: 0; } .flex-container { height: 100%; padding: 0; margin: 0; display: -webkit-box; display: -moz-box; display: -ms-flexbox; display: -webkit-flex; display: flex; align-items: center; justify-content: center; }'+
                // '.cc-result { min-height: 32px; }'+
                '.cc-feedback { margin: 17px 0; line-height: 32px;min-height: 65px; }'+
                'form.cc-curreny-converter { background: #f2f2f2; padding: 40px 12px; text-align: center; flex-basis: 86%;font-size: 20px;}'+
                'input#enter-amount { width: 80%; border: none; height: 36px; padding: 11px; font-size: 20px;}'+
                '.btn-primary { background: #24d594; border: none; padding: 14px 31px; font-size: 19px;}'+
                '.cc-hide{display:none;}';
        var headofdoc = document.getElementsByTagName('head')[0];
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.appendChild(document.createTextNode(mainCss));
        headofdoc.appendChild(s);
	},
	globalVar: function(){
		
			currencyConverter.timer;
			

	},
	buildDiv: function(){

		const div = document.createElement('div');
			        div.setAttribute('class', 'flex-container');
			        

			        div.innerHTML = `<form class="cc-curreny-converter">
			        					<input type="text" placeholder="Amount (GBP)" name="enter-amount" id="enter-amount" autofocus required>
			        					<div class="cc-feedback">
			        						<div class="cc-result"></div>
			        						<div class="cc-timer cc-hide">Expires in <span class="cc-remaining-time">${duration} mins, 0</span> seconds</div>
			        					</div>
										<button type=“submit” class="convert-btn btn btn-primary" aria-label="Login Link">Convert</button>

									
									</form>`;
					document.body.appendChild(div);
	}, 
	bindEvents: function(params){
		const form = document.querySelector('.cc-curreny-converter');
		const input = document.querySelector('#enter-amount');
		form.onsubmit = function(e){
			e.preventDefault();
			const baseVal = input.value.trim();
			if(isNaN(baseVal) === true || baseVal === ''){
				console.log('Invalid Number');
				document.querySelector('.cc-result').textContent = 'Please provide a valid number';
		        document.querySelector('.cc-timer').classList.add('cc-hide');
		    	clearInterval(currencyConverter.timer);


			}else{
				currencyConverter.getData(baseVal);
			}
			// else if(baseVal === '')
			// 	console.log('empty');

		};
	},
	sendHttpRequest: function(method, url, data){

			// Http requests
			// const sendHttpRequest = (method, url, data) => {
			  	const promise = new Promise((resolve, reject) => {
				    const xhr = new XMLHttpRequest();
				    
				    xhr.open(method, url);

				    xhr.responseType = 'json';

				    if (data) {
				      xhr.setRequestHeader('Content-Type', 'application/json');
				    }

				    xhr.onload = () => {
				      if (xhr.status >= 400) {
				        reject(xhr.response);
				      } else {
				        resolve(xhr.response);
				      }
				    };

				    xhr.onerror = () => {
				      reject('Something went wrong!');
				    };

				    xhr.send(JSON.stringify(data));
			  	});
			  	
			  	return promise;
	},
	getData: function(baseValue){
			
			  this.sendHttpRequest('GET', 'https://api.exchangerate-api.com/v4/latest/GBP').then(responseData => {

			     let newCurrencyRate = responseData.rates[newCurrency];
			     console.log(responseData.rates);
			     console.log(newCurrency);
				 
				 currencyConverter.displayResult(newCurrencyRate, baseValue);
				 currencyConverter.startTimer();

			  });


	},
	displayResult: function(newCurrencyRate, baseValue){
		const result = newCurrencyRate * baseValue;

		console.log(result);
		const convertedRate = result.toFixed(2);
		
		document.querySelector('.cc-result').innerHTML = `<span class="cc-base-currency">${baseValue}</span> GBP is equivalent to <span class="cc-converted">${convertedRate}</span> ${newCurrency}`;
		
		// document.querySelector('.cc-error').classList.add('cc-hide');

	},
	startTimer: function(){
		    let convertedDuration = 60 * duration;
		    let minutes;
		    let seconds;

		    //debugger;
		    clearInterval(currencyConverter.timer);

		    currencyConverter.timer = setInterval(timerRuns, 1000);

		    function timerRuns() {
		        minutes = parseInt(convertedDuration / 60, 10);
		        seconds = parseInt(convertedDuration % 60, 10);

		        document.querySelector('.cc-remaining-time').textContent = minutes + " mins, " + seconds;

		        if (--convertedDuration < 0) {
		        	console.log('finish counter');
		        	// convertedDuration = 0
		    		clearInterval(currencyConverter.timer);

		        }
		    }
		

		    setTimeout(function(){
		   
		        document.querySelector('.cc-timer').classList.remove('cc-hide');
		    }, 500);
		    
		    
	}
	

	




};

	try{
		currencyConverter.init();
	}catch(err){
		console.log(err);
	}

})();
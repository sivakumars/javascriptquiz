$(function(){
	
	var score,currentQuestion,userchoices, totalQuestionCount, finishedQnsCount;
	var currentQuizObject =null;
	var quiz = {

		questions :[
					{
						question     : "What is printed in the console?",
						choices      : ["true","false", "reference error"],
						answerIndex  : 0,
						snippet		 : [
										{
											lang : "javascript",
											code : "var foo = function foo() {"+"\n"+
    											    "\t"+"\t"+"console.log(foo === foo);"+"\n"+
    												"};"+"\n"+
    												"foo();"
										}
									   ],
						questionFlag : ""
					},
					{
						question     : "What does the above alert?",
						choices      : ["function","number", "object","undefined"],
						answerIndex  : 3,
						snippet		 : [
										{
											lang : "javascript",
											code : "function aaa() {"+"\n"+
													    "\t"+"return"+"\n"+
													    "\t"+"{"+"\n"+
													    "\t"+"\t"+"test: 1"+"\n"+
													    "\t"+"};"+"\n"+"}"+"\n"+
													    "alert(typeof aaa());"
										}
									   ],
						questionFlag : ""
					},
					{
						question     : "What does the above alert?",
						choices      : ["number","function", "undefined","string","Error"],
						answerIndex  : 1,
						snippet		 : [
										{
											lang : "javascript",
											code : "function bar() {"+"\n"+
														"\t"+"return foo;"+"\n"+
														"\t"+"foo = 10;"+"\n"+
														"\t"+"function foo() {}"+"\n"+
														"\t"+"var foo = '11';"+"\n"+
													    "};"+"\n"+
													    "alert(typeof bar());"
										}
									   ],
						questionFlag : ""
					},
					{
						question     : "What does the above alert?",
						choices      : ["1, 2","1, 3", "2, 1","2, 3","3, 1","3, 2"],
						answerIndex  : 4,
						snippet		 : [
										{
											lang : "javascript",
											code :  "var x=3;"+"\n"+
												    "var foo = {"+"\n"+
													"\t"+"x: 2,"+"\n"+
													"\t"+"baz: {"+"\n"+
													"\t"+"\t"+"x: 1,"+"\n"+
													"\t"+"\t"+"bar: function() {"+"\n"+
													"\t"+"\t"+"\t"+"return this.x;"+"\n"+
													"\t"+"\t"+"}"+"\n"+
													"\t"+"}"+"\n"+
													"}"+"\n"+

													"var go = foo.baz.bar;"+"\n"+

													"alert(go());"+"\n"+
													"alert(foo.baz.bar());"+"\n"
										}
									   ],
						questionFlag : ""
					},
					{
						question     : "What is printed on the console?",
						choices      : ["ReferrenceError","TypeError", "undefined","0","1"],
						answerIndex  : 2,
						snippet		 : [
										{
											lang : "javascript",
											code :  "var x = 0;"+"\n"+
													"function foo() {"+"\n"+
													"\t"+"x++;"+"\n"+
													"\t"+"this.x = x;"+"\n"+
													"\t"+"return foo;"+"\n"+
													"}"+"\n"+
													"var bar = new new foo;"+"\n"+
													"console.log(bar.x);"+"\n"
										}
									   ],
						questionFlag : ""
					},
					{
						question     : "What does the above alert?",
						choices      : ["2","Undefined", "Reference Error"],
						answerIndex  : 1,
						snippet		 : [
										{
											lang : "javascript",
											code : "function foo(a, b) {"+"\n"+
													"\t"+"arguments[1] = 2;"+"\n"+
													"\t"+"alert(b);"+"\n"+
													"}"+"\n"+
													"foo(1);"
										}
									   ],
						questionFlag : ""
					}

				   ],//end of question array

		generate :function(qnIndex){
				
				console.log("****Inside generate*****");
				var question,choices,answer,snippets,qnFlag;				console.log("****Question Flag*****"+qnFlag);
				
				qnFlag = currentQuizObject.questions[qnIndex].questionFlag;
				if(qnFlag){
					question = this.questions[qnIndex].question;
					choices  = this.questions[qnIndex].choices;
					answer   = choices[this.questions[qnIndex].answerIndex];
					snippets = this.questions[qnIndex].snippet;					
					
					renderQuestion(question,choices,answer,snippets,qnFlag);					
				}
				currentQuestion++;
				updateQuestionNo();
				updateScore(score);
				$('.score-wrap').addClass('bounce');
		},

		initialize : function(){
			score = 0;
			currentQuestion = 0;
			finishedQnsCount = [];
			currentQuizObject = this;
			totalQuestionCount = currentQuizObject.questions.length;
			clearQuestionArea();
			clearResultsArea();
			userchoices=[];			
			var randomQuestionIndex = selectQuestionIndex();
			renderQuizResultsArea(totalQuestionCount,finishedQnsCount);
			this.generate(randomQuestionIndex);
			console.log("*****Inside initialize****"+randomQuestionIndex);	
		}
	}

	quiz.initialize();	
	
	function selectQuestionIndex(){		
		var questionIndex;
		var flag;
		do{
			questionIndex = Math.floor(Math.random()*totalQuestionCount);
			flag = currentQuizObject.questions[questionIndex].questionFlag;
		}while(flag);

		currentQuizObject.questions[questionIndex].questionFlag =true;		
		return questionIndex;
	}

	function renderQuestion(question,choices,answer,snippets,qnflag){
		console.log("****Inside renderQuestion*****");
		var noOfChoices = choices.length;	
		
		/*render the code*/
		snippets.forEach(function(snippet){
			var language = snippet.lang;
			var codeSnippet = snippet.code;
			var langClass = (language == "javascript")?"language-javascript":"none";
			
			var $code = $('<code></code>').addClass(langClass).text(codeSnippet);
			var $snippetArea = $('<pre></pre>').addClass('line-numbers snippet')
											   .addClass(langClass)
											   .append($code);
			var $codeArea = $('<div></div>').addClass('code-area').append($snippetArea);
			$('.quiz-area').append($codeArea);
		});

		var $question = $('<p></p>').addClass('question').text(question);
		$('.quiz-area').append($question);

		var optionWidth ="";
		var option="";
		if(noOfChoices>=4){
			optionWidth = " width-90pc";
		}		
		var $choices = $('<ul></ul>').addClass('choices');
		/*constructing the options*/
		choices.forEach(function(optionText, no){
			option = $('<li></li>').addClass('inlineblock btn'+optionWidth);
			if(optionText == answer){
				option.attr('data-choice',true);
			}					   
			option.append($('<span></span>').text(optionText));
			$choices.append(option);
		});
		$('.quiz-area').append($choices);
	}

	function renderQuizResultsArea(totalQuestions,results){
		var $quizResults = $('.quiz-results');
		var $result = null;		
		var bgColor;
		for(var i=1; i<=totalQuestions; i++){
			bgColor = "";
			if(results[i-1]=="G"){
				bgColor = " bg-green";
			}else if(results[i-1]=="R"){
				bgColor = " bg-red";
			}
			$result = $('<li></li>').addClass('inlineblock'+bgColor)
									.append($('<span></span>')
									.text(i));
			$quizResults.append($result);
		}
	}

	function clearQuestionArea(){
		$('.quiz-area').children().remove();				
	}

	function clearResultsArea(){
		$('.quiz-results').children().remove();
	}

	function updateQuestionNo(){
		$('.question-count').find('span').text(currentQuestion+"/"+totalQuestionCount);
	}

	function updateScore(userscore){
		$('.score-wrap').find('#score').text(userscore);
	}

	function updateResults(questionNo, result){
		console.log("Inside result update");
		finishedQnsCount.push(result?"G":"R");		
		console.log("Inside result update end"+finishedQnsCount);
	}

	/*Continue with the quiz*/
	$('.continue').click(function(){
		console.log("****Inside Continue******");
		if(currentQuestion< totalQuestionCount){
			$(this).slideUp('faster');
			$('.deactivate').hide();
			clearQuestionArea();
			clearResultsArea();
			renderQuizResultsArea(totalQuestionCount,finishedQnsCount);
			currentQuizObject.generate(selectQuestionIndex());			
		}else{
			$(this).slideUp('faster');
			var gameMessage ="";
			var percentage = (score/(totalQuestionCount))*100;
			if(percentage==100){
				gameMessage ="You are a JS Ninja!!!";
			}else if(percentage>=90){
				gameMessage ="You did GREAT!";
			}else if(percentage>=50){
				gameMessage = "You can do better!?";
			}else{
				gameMessage ="SORRY!..you lose :("
			}
			$('.content').find('p').first().text(gameMessage);
			$('#modal').show();
			$('.quiz-area').hide();
		}
	});

	/*On choosing an answer this gives a frozen effect on the
	  screen by overlaying a transparent background and a link to the next button */
	$('.quiz-area').on('click','li',function(){
		var userchoice = $(this).data('choice');
		var $feedbackObj;
		var feedback;		
		if(userchoice){
			feedback ="Correct";
		    updateScore(++score);
		    updateResults(currentQuestion, true);			
			$(this).css({"background-color":"green"});
		}else{
			feedback = "Incorrect";
			updateResults(currentQuestion, false);
			$(this).css({"background-color":"red"});
		}
		clearResultsArea();		
		renderQuizResultsArea(totalQuestionCount,finishedQnsCount);
		console.log("*******finishedQnsCount****"+finishedQnsCount);
		$('.show-feedback').find('h2').text(feedback);
		$('.show-feedback').fadeIn(500,function(){
			$(this).fadeOut(2000);			
		});	
		$('.deactivate').show();
		$('.continue').show();	
	});
});
/** @typedef {import('../src/message.js').DevvitSystemMessage} DevvitSystemMessage */
/** @typedef {import('../src/message.js').WebViewMessage} WebViewMessage */

class App {
  constructor() {

    addEventListener('load', () => {

      //page loaded. send message to devvit. devvit will send the question.
      postWebViewMessage({ type: 'webViewReady' });
    });

    window.addEventListener('message', (event) => {
      if (event.data.type === 'devvit-message') {
        const { data } = event.data;
        console.log('Received from Devvit:', data);


        // if type == newQuestion ; display new question

        
      }
    });


    this.submitBtn = /** @type {HTMLSpanElement} */ (document.querySelector('#submitBtn'));

    this.submitBtn.addEventListener('click',(e)=>{
      postWebViewMessage({type:'submit' , userSentence : "this is user sentece sent from webview"});

      //change html view to submitted page
    })
    
  
  /**
   * @arg {MessageEvent<DevvitSystemMessage>} ev
   * @return {void}
   */
 
  };
}

/**
 * Sends a message to the Devvit app.
 * @arg {WebViewMessage} msg
 * @return {void}
 */
function postWebViewMessage(msg) {
  parent.postMessage(msg, '*');
}

new App();

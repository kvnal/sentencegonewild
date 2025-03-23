/** @typedef {import('../src/message.ts').DevvitSystemMessage} DevvitSystemMessage */
/** @typedef {import('../src/message.ts').WebViewMessage} WebViewMessage */

class App {
  constructor() {
    // Get references to the HTML elements

    // When the Devvit app sends a message with `postMessage()`, this will be triggered
    // This event gets called when the web view is loaded
    addEventListener('load', () => {
      postWebViewMessage({ type: 'webViewReady' });
    });

    window.addEventListener('message', (event) => {
      if (event.data.type === 'devvit-message') {
        const { data } = event.data;
        console.log('Received from Devvit:', data);
      }
    });


    this.submitBtn = /** @type {HTMLSpanElement} */ (document.querySelector('#submitBtn'));

    this.submitBtn.addEventListener('click',(e)=>{
      postWebViewMessage({type:'submit'})
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

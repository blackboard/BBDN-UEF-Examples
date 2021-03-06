/*
 * Copyright (C) 2019, Blackboard Inc.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  -- Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *  -- Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 *  -- Neither the name of Blackboard Inc. nor the names of its contributors
 *     may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY BLACKBOARD INC ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL BLACKBOARD INC. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Verify that we're in the integration iframe
if (!window.parent) {
    throw new Error('Not within iframe');
}

/* Initialize messageChannel */
let messageChannel;

let panel_url = app_url + '/helloworld/';

/* Add an event listener to listen for messages. When one is received, call onPostMessageReceived() */
window.addEventListener("message", onPostMessageReceived, false);

/* Post a message to tell Ultra we are here. learn_url is a variable set in index.html  */
window.parent.postMessage({"type": "integration:hello"}, learn_url + '/*');

/*
 * Called when we receive a message. 
 */
function onPostMessageReceived(evt) {

    // Determine whether we trust the origin of the message. learn_url is a variable set in index.html
    const fromTrustedHost = evt.origin === window.__lmsHost || evt.origin === learn_url;

    if (!fromTrustedHost || !evt.data || !evt.data.type) {
        return;
    }

    // If Ultra is responding to our hello message
    if (evt.data.type === 'integration:hello') {

        //Create a logged message channel so messages are logged to the Javascript console
        messageChannel = new LoggedMessageChannel(evt.ports[0]);
        messageChannel.onmessage = onMessageFromUltra;
  
        // Ultra is listening. Authorize ourselves using the REST token we received from 3LO
        // token is a variable set in index.html
        messageChannel.postMessage({
            type: 'authorization:authorize',
            token: token
        });
    }
  
}

/*
 * Called when our message processor receives amessage from Ultra. 
 */
function onMessageFromUltra(message) {
    
    // We received a message from Ultra stating that our authorization request was successful.
    if (message.data.type === 'authorization:authorize') {
      onAuthorizedWithUltra();
    }

}

/*
 * Called upon successful authorization. This registers our application as a listener with Ultra
 * and specifies the events we want to listen for
 */
function onAuthorizedWithUltra() {
  
    messageChannel.postMessage({
        type: 'event:subscribe',
        subscriptions: ['click','hover','route','portal:new','portal:remove'],
    });

}

/**
 * A MessageChannel-compatible API, but with console logging.
 */
class LoggedMessageChannel {

    onmessage = () => { 
        console.log('test');
    };
  
    constructor(messageChannel) {
        this.messageChannel = messageChannel;
        this.messageChannel.onmessage = this.onMessage;
    }
  
    onMessage = (evt) => {
        console.log(`[UEF] From Learn Ultra:`, evt.data);
        this.onmessage(evt);
    };
  
    postMessage = (msg) => {
        console.log(`[UEF] To Learn Ultra`, msg);
        this.messageChannel.postMessage(msg);
    }

}
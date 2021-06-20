document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => {
    load_mailbox('inbox');
    show_inbox();
  });
  document.querySelector('#sent').addEventListener('click', () => {
    load_mailbox('sent');
    show_sent();
  });
  document.querySelector('#archived').addEventListener('click', () => {
    load_mailbox('archive');
    show_archived();
  });
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
  show_inbox();

  // Run send_email function when the compose-submit is clicked
  document.querySelector('form').onsubmit = () => send_email();
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function send_email() {
  //Get data to submit to API
  const recipients = document.getElementById('compose-recipients').value;
  const subject =  document.getElementById('compose-subject').value;
  const body = document.getElementById('compose-body').value;

  //Submit Data to API
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });

  //Load Inbox
  return load_mailbox('inbox');
}

function show_inbox() {

  let emailsView = document.querySelector("#emails-view");

  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {

    /*
    Show Email in inbox
    Step-1 Iterate Through the Emails Object that the API Returned
    Step-2 Check if the Email is Read or Not
    Step-3 If Email is Read, then set the html of the email to gray and add other html
    */
    for (const email in emails) {
      if (emails[email].read === true) {
      emailsView.innerHTML += 
      `
      <a id="${emails[email].id}" class="show_email" onclick="show_email(this.id)">
      <div class="d-flex bd-highlight border border-dark border-1 mb-2 bg-light">
        <div class="p-2 bd-highlight fw-light">${emails[email].sender}</div>
        <div class="p-2 flex-grow-1 bd-highlight">${emails[email].subject}</div>
        <div class="p-2 bd-highlight fw-light">${emails[email].timestamp}</div>
      </div>
      </a>
      `;
      } else {
      emailsView.innerHTML += 
      `
      <a id="${emails[email].id}" class="show_email" onclick="show_email(this.id)">
      <div class="d-flex bd-highlight border border-dark border-1 mb-2">
        <div class="p-2 bd-highlight fw-light">${emails[email].sender}</div>
        <div class="p-2 flex-grow-1 bd-highlight">${emails[email].subject}</div>
        <div class="p-2 bd-highlight fw-light">${emails[email].timestamp}</div>
      </div>
      </a>
      `;
      }
    }
  });
  return true;
}

function show_sent() {

  let emailsView = document.querySelector("#emails-view");

  fetch('/emails/sent')
  .then(response => response.json())
  .then(emails => {

    /*
    Show Email in Sents
    Step-1 Iterate Through the Emails Object that the API Returned
    Step-2 Write Inner HTML
    */
    for (const email in emails) {
      emailsView.innerHTML += 
      `
      <a id="${emails[email].id}" class="show_email" onclick="show_email(this.id)">
      <div class="d-flex bd-highlight border border-dark border-1 mb-2 bg-light">
        <div class="p-2 bd-highlight fw-light">${emails[email].sender}</div>
        <div class="p-2 flex-grow-1 bd-highlight">${emails[email].subject}</div>
        <div class="p-2 bd-highlight fw-light">${emails[email].timestamp}</div>
      </div>
      </a>
      `;
    }
  });
  return true;
}

function show_email(id) {
  let buttonText = '';
  singleView = document.querySelector("#single-view");

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email

      if (email['archived'] == false) {
        buttonText = "Archive";
      } else {
        buttonText = "Unarchive";
      }

      singleView.innerHTML =
      `
      <div class="card">
      <div class="card-header">
        Sent By: ${email.sender} <br>
        Sent To: ${email.recipients.join(",")} <br>
        Sent At: ${email.timestamp} <br>
      </div>
      <div class="card-body">
        <h5 class="card-title">${email.subject}</h5>
        <p class="card-text">${email.body}</p>
        <a href="" class="btn btn-primary" onclick="archive_email(${email.id})">${buttonText}</a>
        <a href="" class="btn btn-primary">Go Back</a>
      </div>
    </div>
      `;

      if (email['read'] == false) {
        //making the read attribute true
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })  
        })
      }
  });
}

function show_archived() {

  let emailsView = document.querySelector("#emails-view");

  fetch('/emails/archive')
  .then(response => response.json())
  .then(emails => {

    /*
    Show Email in Sents
    Step-1 Iterate Through the Emails Object that the API Returned
    Step-2 Write Inner HTML
    */
    for (const email in emails) {
      emailsView.innerHTML += 
      `
      <a id="${emails[email].id}" class="show_email" onclick="show_email(this.id)">
      <div class="d-flex bd-highlight border border-dark border-1 mb-2 bg-light">
        <div class="p-2 bd-highlight fw-light">${emails[email].sender}</div>
        <div class="p-2 flex-grow-1 bd-highlight">${emails[email].subject}</div>
        <div class="p-2 bd-highlight fw-light">${emails[email].timestamp}</div>
      </div>
      </a>
      `;
    }
  });
  return true;
}

function archive_email(id) {
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      if (email['archived'] == false) {
        //making the read attribute true
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
          archived: true
          })  
        })
      } else {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
          archived: false
          })  
        })
      }
  });
  return true;
}
document.addEventListener('DOMContentLoaded', function() {



  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  

  // sending the email



  
    
  
  // By default, load the inbox
  load_mailbox('inbox');

});



document.addEventListener('DOMContentLoaded', function() {


document.querySelector('#compose-form').onsubmit = send_email;
});






// ---------------- functions -------------------------------
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
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

  // Show the mailbox name
  document.querySelector('#emails-view-headline').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
   

    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
      if(mailbox === 'sent' && emails != null)
      {
      
          const row = document.createElement('div');
          
          row.innerHTML = `<p> Email to ${email.recipients} Sent ${email.timestamp}. Subject: ${email.subject} </p>`;

          if(email.read === true)
          {
            row.classList.add('email', 'p-2', 'm-3');

            row.classList.add('read');
          }
          // check if email is read or unread 


          row.classList.add('email', 'p-2', 'm-3');
          
          document.querySelector('#emails-view-headline').appendChild(row);

        }
        
       


        if(mailbox === 'inbox')
        {
        const row = document.createElement('div');
        row.innerHTML = `<p> Email from ${email.sender} </p> <p> Recieved ${email.timestamp}</p> <p>Subject: ${email.subject} </p>`;
        if(email.read === true)
        {
          row.classList.add('read');
          row.classList.add('email', 'p-3', 'm-3');
          

        }
        // check if email is read or unread 


        row.classList.add('email', 'p-2', 'm-3');
        
        document.querySelector('#emails-view-headline').appendChild(row);
        }


        
      });
      });
 
    
  
}    

function send_email(e)
{

  e.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value
  const subject = document.querySelector('#compose-subject').value
  const body = document.querySelector('#compose-body').value
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
      load_mailbox('sent');

  });


}

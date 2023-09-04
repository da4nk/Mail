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
  document.querySelector('.email-body').style.display = 'none';
  document.querySelector('#emails-view-headline').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';






}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('.email-body').style.display = 'none';
  document.querySelector('#emails-view-headline').style.display = 'none';

  
  
  

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
   

    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {

      const row = document.createElement('div');
      
      if(mailbox === 'sent' && emails != null)
      {
          
          row.innerHTML = `<p> Email to ${email.recipients} Sent ${email.timestamp}. Subject: ${email.subject} </p>`;

          //  check if email is read
          email.read ? row.classList.add('email', 'p-3', 'm-3') : row.classList.add('read', 'email', 'p-3', 'm-3');

          document.querySelector('#emails-view').appendChild(row);

        }

        
       


        if(mailbox === 'inbox' && emails != null)
        {
          // make button
          const row = document.createElement('div');
          const button = document.createElement('BUTTON');
          button.innerHTML = '<i class="fa-solid fa-envelope"></i> mark as read';
          button.classList.add('btn','btn-light','button');
          row.addEventListener('click', () => view_email(email, row));
          row.innerHTML = `<p> Email from ${email.sender} </p> <p> Recieved ${email.timestamp}</p> <p>Subject: ${email.subject} </p>`;
          row.appendChild(button);
        
        
        
         
        // check if email is read or unread 
        email.read == false ? row.classList.add('email', 'p-3', 'm-3') : row.classList.add('read', 'email', 'p-3', 'm-3');  

        document.querySelector('#emails-view').appendChild(row);
        
        

      }
      if(mailbox === 'archive')
      {
        if(emails === null)
        {
          row.innerHTML = '<div> <h2>No archived Emails Yet <h2> </div';
          row.classList.add('display-2');
        }  
        


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

function view_email(email, row)
{



  // clear out pages
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emails-view-headline').style.display = 'block';
    document.querySelector('#emails-view').style.display = 'none';
    // select element
    const body = document.querySelector('.email-body');
    body.style.display = 'block';
    

    // create html elements
    var row = document.createElement('div');
    const button = document.createElement('button');
    const container = document.createElement('div');
    const emailheadline = document.querySelector('#emails-view-headline');
    if(emailheadline.childElementCount != -1)
    {
      emailheadline.removeChild(emailheadline.firstChild);
      
      
    }

    // get specific emails

    fetch(`/emails/${email.id}`).then(
      response => response.json()).
      then(emails => {

        emails.read = true;

        // make html content for each element
        
        button.innerHTML = ` Reply `;

          row.innerHTML = `<div>  
          <ul>From: ${emails.sender}</ul>  
          <ul>To: ${emails.recipients}</ul>  
          <ul>Subject: ${emails.subject}</ul>  
          <ul>TimeStamp: ${emails.timestamp}</ul>  
          </div>
          `;
          
          body.innerHTML = `${emails.body}`;

          // add styling
          row.classList.add('pb-1', 'm-2');
          button.classList.add('ml-5','btn', 'btn-sm', 'btn-outline-primary');
          body.classList.add('p-2', 'ml-5');
          // append multiple elements into one
          container.appendChild(row);
          container.appendChild(button);  
      });  
      // append container of elements to view
      document.querySelector('#emails-view-headline').appendChild(container);


}

function email_read(read)
{
  return true;
}
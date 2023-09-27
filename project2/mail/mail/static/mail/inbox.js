document.addEventListener('DOMContentLoaded', function() {



  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  

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
  document.querySelector('.buttons').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
   

    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {

      // create row element
      const row = document.createElement('div');
      
      // open sent mailbox
      if(mailbox === 'sent' && emails != null)
      {
          // email row content
          row.innerHTML = `<p> Email to ${email.recipients} Sent ${email.timestamp}. Subject: ${email.subject} </p>`;
          
          //  check if email is read
          email.read ? row.classList.add('email', 'p-3', 'm-3') : row.classList.add('read', 'email', 'p-3', 'm-3');
          
          // append row to the use view
          document.querySelector('#emails-view').appendChild(row);

        }
        // open inbox
        if(mailbox === 'inbox' )
        {
          // view the email
          row.addEventListener('click', () => view_email(email, row));

          // email row
          row.innerHTML = `<p> Email from ${email.sender} </p> <p> Recieved ${email.timestamp}</p> <p>Subject: ${email.subject} </p>`;
        
        // check if email is read or unread 
        email.read == false ? row.classList.add('email', 'p-3', 'm-3') : row.classList.add('read', 'email', 'p-3', 'm-3');  
        // append row to the use view
        document.querySelector('#emails-view').appendChild(row);
      }





      // open archive
      if(mailbox === 'archive' )
      {
        // view email content
        row.addEventListener('click', () => view_email(email, row));
        // email content information
        row.innerHTML = `<p> Email from ${email.sender} </p> <p> Recieved ${email.timestamp}</p> <p>Subject: ${email.subject} </p>`;

        // check if email is read or unread 
        email.read == false ? row.classList.add('email', 'p-3', 'm-3') : row.classList.add('read', 'email', 'p-3', 'm-3');  
        // append email to view
        document.querySelector('#emails-view').appendChild(row);
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
    document.querySelector('.buttons').style.display = 'block';
    // select element
    const body = document.querySelector('.email-body');
    body.style.display = 'block';

    const archive_button = document.querySelector('.Archive');

    
    // create html elements
    var row = document.createElement('div');
    const button = document.createElement('button');
    var container = document.createElement('div');
    const emailheadline = document.querySelector('#emails-view-headline');
    
    emailheadline.innerHTML = '';   

  


      // mark email as read
      fetch( `/emails/${email.id}`,{
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
      
    });

    // archive funciton for button
    archive_button.addEventListener('click', (e) => 
    {
      e.preventDefault();
      archive(email);
    }
    );

    
    // change button state based on whether or not email is archived
    if(email.archived === true)
    {
      archive_button.innerHTML = 'Unarchive';
    }
    if(email.archived === false)
    {
      archive_button.innerHTML = 'Archive';
    }


    
    // get specific emails
    fetch(`/emails/${email.id}`).then(
      response => response.json()).
      then(emails => {

        // make html content for each element        
        button.innerHTML = ` Reply `;

          row.innerHTML = `<div>  
          <ul>From: ${emails.sender}</ul>  
          <ul>To: ${emails.recipients}</ul>  
          <ul>Subject: ${emails.subject}</ul>  
          </div>
          `;
          
          body.innerHTML = `${emails.body}`;

          // add styling
          row.classList.add('pb-1', 'm-2');
          body.classList.add('p-2', 'ml-5');
          container.classList.add('container');

          // append multiple elements into one
          container.appendChild(row);
        
      });  
      // append container of elements to view

      document.querySelector('#emails-view-headline').append(container);
    }

function archive(email)
{
  // fetch the email json data
  
  fetch(`/emails/${email.id}`).then(
    response => response.json().then(
      archivedstate => 
      {
        // check whehter or not email is archived
        const isarchived = archivedstate.archived;
        // turn the emailstate to the opposite of that current state
        const newarchived_state = !isarchived;
        // fetch the email data and change the archived state
        fetch(`/emails/${email.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            archived: newarchived_state
          })
  
        })
      }
    
      )


  );
  load_mailbox('inbox');
}

function reply(email)
{
  emailheadline = querySelector('.emails-view-headline');
  compose = querySelector('compose-view');
  emailheadline.style.display = 'none';
  compose.style.display = 'block';
}

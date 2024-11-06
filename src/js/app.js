import { interval, mergeMap, catchError } from 'rxjs';
import { ajax } from 'rxjs/ajax';

const messagesTable = document.getElementById('messagesTable');
const messagesTableBody = messagesTable.getElementsByTagName('tbody')[0];

const formatDate = timestamp => {
  const date = new Date(timestamp * 1000);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

const formatSubject = subject => {
  return subject.length > 15 ? subject.substring(0, 15) + '...' : subject;
};
interval(5000)
  .pipe(
    mergeMap(() => ajax.getJSON('http://localhost:3000/messages/unread').pipe(
      catchError(() => interval(5000))
    ))
  )
  .subscribe(data => {
    if (data.status === 'ok') {
      data.messages.forEach(message => {
        const row = messagesTableBody.insertRow(0);
        const fromCell = row.insertCell();
        const subjectCell = row.insertCell();
        const receivedCell = row.insertCell();
        fromCell.textContent = message.from;
        subjectCell.textContent = formatSubject(message.subject);
        receivedCell.textContent = formatDate(message.received);
      });
    }
  });
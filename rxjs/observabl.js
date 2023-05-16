import {Observable} from 'rxjs'

const input = document.querySelector('input');


const observable$ = new Observable((observer)=>{
    // DOM Event

    const inputHandler = (e) => observer.next(e.target.value);
    input.addEventListener('input', inputHandler);

    // observer.error('error message');
    // observer.complete()
})

const observer = {
   next:(value)=>console.log('input event',value),
   error:(error)=>console.log(error),
   complete:()=>console.log('complete') 
}

const subscription =observable$.subscribe(observer);


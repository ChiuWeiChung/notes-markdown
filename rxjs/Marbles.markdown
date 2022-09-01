# Marble Diagram

How does a marble diagram look like? Let's start with a simple timeline. It represents the passing time after we subscribe to an Observable. And, as long as the Subscription is active, we might expect some emissions to happen and we are able to picture them on this timeline. If we would have an Observable which never emits anything, this is exactly how the marble diagram for such Observable would look like - just the timeline and nothing else.

```console
never emits anything

------------------------------>Time Line

```

## next notification

Now, let's say we have a scenario in which the Observable emits some value A after some time. Then some more time passes and it emits a value B. And even later, it emits a value C. Thanks to this marble diagram, we can easily present such scenario. And those three marbles represent three next notifications with some values. And we can easily see the order and approximate time at which each one of them was emitted. The Observable might emit any number of next notifications. So, we can have an Observable which never emits any values, any next notifications and, on the other hand, we can have an Observable which emits thousands of next notifications.

```console

------A-------B--------C----------->Time Line
    next
```

## complete notification

OK, we now know how the next notifications look like on a marble diagram. We have two more notification types, so let's see them. If we would like to signal that the Observable's data source has finished and there are no more values to be emitted, we would use the complete notification. After a complete notification gets emitted, it means that the `Observable has finished its work, will not emit any more values, and the Subscription will end automatically`. So, the complete notification can be emitted only once. Of course, there might be some Observables which never complete. For example, an Observable with some infinite interval counter inside would keep on counting and emitting values until we unsubscribe. Contrary to the next notifications, which had some value assigned to each one of them, the complete notification doesn't carry any value with it.

```console

------A-------B--------C-----|----->Time Line
                          Complete

```

## error notification

The last notification type in the world of Observables is the error notification. Whenever something unexpected happens or the Observable wants to signal that its data source failed, the error notification is emitted. The error notification behaves in a similar way to the complete notification. `It also ends the Subscription, so there can be one error emission at most, and is always going to be the last one`. The difference is that the `error notification can carry a payload`, so it's possible to pass some value describing the error. And that can be a standard JavaScript error object, for example. In fact, if some unhandled JavaScript error would happen inside of the Observable, it would be automatically emitted as an error notification.

```console

------A-------B--------C-----X----->Time Line
                           Error

```

## Summary

Let's summarize all types of notifications that an Observable can emit during the Subscription's lifetime. First, we have the next notification, which is used to emit values. The next notification can be emitted any number of times during the Subscription's lifetime. Second, we have the error notification, which is used to signal an error or some failure, and it can also carry a payload with the error details with it. The error notification can be emitted only once as it ends the Subscription. Lastly, we have the complete notification used to inform that the Observable's source has no more values to emit. The complete notification can be emitted only once as it also finalizes the Subscription.

- What is the 'next' notification used for? emitting a value
- How many values can an Observable emit during the Subscription's lifetime? zero or one or more.
- The error notification signals an issue with the source.
- The complete notification signal the observable has no more data to emit.
- error and complete notifications can be emitted only once during the subscription lifetime.

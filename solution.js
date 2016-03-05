{
    init: function(elevators, floors) {
        var elevator = elevators[0];
        elevator.destinationQueue = [];
        
        var allQueue = [];
        
        elevators.forEach(function(elevator) {  
            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                console.log("Elevator Idle");

                if(elevator.destinationQueue.length < 1 && allQueue.length > 0)
                {
                    // pick up from allQueue
                    elevator.goToFloor(allQueue.shift());
                }

                elevator.checkDestinationQueue();

                console.log("Elevator Queue: " + elevator.destinationQueue);

            });

            elevator.on("floor_button_pressed", function(floorNum) {
                console.log("Elevator floor_button_pressed. Floor: "+ floorNum);

                // if it is already in queue; don't re-add it
                if(elevator.destinationQueue.indexOf(floorNum) < 0)
                    elevator.goToFloor(floorNum);
                console.log("Elevator Queue: " + elevator.destinationQueue);
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                // remove redundancy in global queue
                var itemIndex = allQueue.indexOf(floorNum);
                if(itemIndex > -1)
                {
                    allQueue.splice(itemIndex, 1);
                }
            });
        
        });
        
        floors.forEach(function(floor) {
            floor.on("up_button_pressed", function() {
                console.log("Elevator up_button_pressed. Floor: "+ floor.floorNum());
                
                // if it is already in queue; don't re-add it
                if(allQueue.indexOf(floor.floorNum()) < 0)
                {
                    if(!sendAvailableElevator(floor.floorNum()))
                        allQueue.push(floor.floorNum());
                }
                
                console.log("Elevator Queue: " + elevator.destinationQueue);
            });

            floor.on("down_button_pressed", function() {
                console.log("Elevator down_button_pressed. Floor: "+ floor.floorNum());
                
                // if it is already in queue; don't re-add it
                if(allQueue.indexOf(floor.floorNum()) < 0)
                {
                    if(!sendAvailableElevator(floor.floorNum()))
                        allQueue.push(floor.floorNum());
                }
                
                console.log("Elevator Queue: " + elevator.destinationQueue);
            });
            
            function sendAvailableElevator(floorNum)
            {
                elevators.forEach(function(elevator) {
                    if(elevator.destinationQueue.length < 1) {
                       elevator.goToFloor(floorNum);
                       return true;
                   }
                });
                
                // by now no one has been sent
                return false;
            }
        });

          
                    
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
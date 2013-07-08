"use strict";

!function($, DX, wo, undefined) {
    var CURRENT_KEY = "dxworkout-current-workout",
        WORKOUTS_KEY = "dxworkout-workouts",
        workoutArray;

    function insertWorkout(workout) {
        workoutArray.push(workout);
        saveWorkouts();
    }

    function updateWorkout(id, workout) {
        var index,
            array = workoutArray();
        for (index = 0; index < array.length; index++) {
            if (array[index].id === id)
                break;
        }

        workoutArray.splice(index, 1, workout);
        saveWorkouts();
    }

    function deleteWorkout(id) {
        workoutArray.remove(function(item) {
            return item.id === id;
        });
        saveWorkouts();
    }

    function saveWorkouts() {
        localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workoutArray()));
    }

    function initCurrentWorkout() {
        var current = wo.createWorkoutViewModel(),
            savedData = localStorage.getItem(CURRENT_KEY);
        if (savedData)
            current.fromJS(JSON.parse(savedData));
        else
            current.clear();

        wo.currentWorkout = current;
        wo.currentId = current.id() || (new DevExpress.data.Guid).toString();
    }

    function setCurrentWorkoutById(id) {
        var workout = wo.currentWorkout,
            currentId = wo.currentId;

        if (id != currentId) {
            var index,
                foundItem,
                array = workoutArray();
            for (index = 0; index < array.length; index++) {
                if (array[index].id === id) {
                    foundItem = array[index];
                    break;
                }
            }

            workout = wo.createWorkoutViewModel();
            if (foundItem)
                workout.fromJS(foundItem);
            else
                workout.clear();
            wo.currentWorkout = workout;
            wo.currentId = id;
        } else if (!workout) {
            workout = wo.createWorkoutViewModel();
            workout.clear();
            wo.currentWorkout = workout;
        }
        return workout;
    }

    function saveCurrentWorkout() {
        var data = JSON.stringify(wo.currentWorkout.toJS());
        localStorage.setItem(CURRENT_KEY, data);
    }

    function removeCurrentWorkout() {
        localStorage.removeItem(CURRENT_KEY);

        wo.currentWorkout = null;
        wo.currentId = (new DevExpress.data.Guid).toString();
    }

    function initSetting(key) {
        var settingsFromStorage = localStorage.getItem("dxworkout-settings-" + key),
            currentSettings;
        if(settingsFromStorage) {
            currentSettings = JSON.parse(settingsFromStorage); 
        } else {
           currentSettings = wo.defaultSettings[key]; 
        }
        wo.settings[key] = currentSettings;
    }

    function saveSetting(key, value) {
        wo.settings[key] = value;
        localStorage.setItem("dxworkout-settings-" + key, JSON.stringify(value));
    }

    function initUserData() {
        var result = $.Deferred();

        initSetting("goal");
        initSetting("exercise");
        initSetting("equipment");
        initSetting("lengthUnit");
        initSetting("weightUnit");
        initCurrentWorkout();

        var storageData = localStorage.getItem(WORKOUTS_KEY);
        var data = storageData ? JSON.parse(storageData) : [];
        var state = data.length > 0
                ? wo.initStates.NORMAL
                : wo.initStates.EMPTY;

        workoutArray = wo.workouts = ko.observableArray(data);
        return result.resolve(state).promise();
    }

    function clearUserData() {
        var localStorageKeys = [
            CURRENT_KEY,
            WORKOUTS_KEY,
            "dxworkout-settings-exercise",
            "dxworkout-settings-equipment",
            "dxworkout-settings-lengthUnit",
            "dxworkout-settings-weightUnit"
        ];

        $.each(localStorageKeys, function () {
            localStorage.removeItem(this);
        });
    }

    $.extend(wo, {
        workouts: null,

        insertWorkout: insertWorkout,
        updateWorkout: updateWorkout,
        deleteWorkout: deleteWorkout,

        initUserData: initUserData,
        clearUserData: clearUserData,

        initCurrentWorkout: initCurrentWorkout,
        setCurrentWorkoutById: setCurrentWorkoutById,
        saveCurrentWorkout: saveCurrentWorkout,
        removeCurrentWorkout: removeCurrentWorkout,
        
        saveSettings: saveSetting,
        settings: {}
    });

    
}(jQuery, DevExpress, DXWorkout);
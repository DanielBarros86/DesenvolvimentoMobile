"use strict";

DXWorkout.EditList = function(params) {
    var key = params.id,
        title,
        titleBag,
        newValue = ko.observable(""),
        emptyValue = "Enter new " + key + "...",
        keySettings = ko.observableArray();

    titleBag = ["Edit ", key.substr(0,1).toUpperCase(), key.substr(1)];
    if (key != "equipment")
        titleBag.push("s");
    title = titleBag.join("");

    function showToast(message) {
        DevExpress.ui.notify({ message: message, position: { of: '.dx-viewport .layout-content' } });
    }

    function handleDeleteClick(e) {
        var message = key.substr(0, 1).toUpperCase() + key.substr(1) + " \"" + e.model + "\" was deleted";
        keySettings.splice(keySettings.indexOf(e.model), 1);
        DXWorkout.saveSettings(key, keySettings());

        showToast(message);
    }

    function handleAddClick() {
        var added = false,
            formattedNewValue = $.trim(newValue());
        newValue(""); 
        if(formattedNewValue) {
            var message = "New " + key + " \"" + formattedNewValue + "\" was added";
            $.each(keySettings(), function(key, value) {
                if (value.toLowerCase() === formattedNewValue.toLowerCase()) {
                   added = true;
                   return false; 
                }
            });
            if(!added) {
                keySettings.push(formattedNewValue);
                keySettings.sort();
            }

            DXWorkout.saveSettings(key, keySettings());
            showToast(message);
        }   
    }

    keySettings(DXWorkout.settings[key]);


    return {
        currentNavigationItemId: "Settings",

        keySettings: keySettings,
        title: title,
        newValue: newValue,
        emptyValue: emptyValue,

        handleDeleteClick: handleDeleteClick,
        handleAddClick: handleAddClick
    };
};
var myModule = (function () {
    let aFragments = [],       // array to hold each fragment watched
        nAdjustedPlayTime = 0, // play time in ms (adjusted if needed)
        nPreviousTime = 0,     // time saved previously by 'ontimeupdate'
        nCurrentTime = 0;      // current time

    // update the times onPlay of video, so start time is set correctly
    const updateTimes = nTime => {
        let nLastTime = aFragments.length ? aFragments[aFragments.length-1].end : 0,
            nThisCurrentTime = nTime * 1000,
            nDiff = nThisCurrentTime - nLastTime;
        // Fix the onplay time after pausing video (if delayed) for the purpose of the demo
        nAdjustedPlayTime = (nDiff > 0 && nDiff < 1000) ? nLastTime : nThisCurrentTime
    };

    // set the previous and current times on the timeUpdate event from the player
    const timeUpdate = nTime => {
        nPreviousTime = nCurrentTime;
        nCurrentTime = nTime * 1000;
    };

    // Take array of unsorted play fragments, then sort and merge where possible
    const sortAndMergeFragments = aAllFragments => {
        const aMergedFragments = []; // initialise array to hold results if we get any
        let oLastFragment;           // the last fragment processed

        // sort the Fragments before merging
        aAllFragments.sort((a, b) => a.start - b.start);

        // process all fragments, merging those which overlap
        aAllFragments.forEach(oFragment => {
            // if first fragment or if start of this fragment is after end of last fragment
            if (!oLastFragment || oFragment.start > oLastFragment.end) {
                aMergedFragments.push(oLastFragment = oFragment); // add to results
            }
            // update end value of last fragment if end value of this fragment exceeds it
            else if (oFragment.end > oLastFragment.end) {
                oLastFragment.end = oFragment.end;
            }
        });
        // return array of merged fragments
        return aMergedFragments;
    }

    // Take string or object and print to the logger element on the page
    const logToPage = message => {
        const eLogger = document.querySelector('#logger');

        if (typeof message == 'object') {
            eLogger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            eLogger.innerHTML += message + '<br />';
        }
    }

    // check the text input on page for a valid array and if exists, push values to the aFragments array
    const checkTextboxForFragments = sInputFragments => {
        // clean with some rudimentary regex and return if no value
        sInputFragments.replace(/[^0-9 \[\]\,]/g, "");
        if(!sInputFragments.length) {
            return;
        }

        // push to fragments array if one or more fragments are present
        let aInputArray = $.parseJSON(sInputFragments);
        aInputArray.forEach(aFragment => {
            aFragments.push({
                start: aFragment[0],
                end: aFragment[1]
            });
        });

    }

    // add play fragments to the aFragments array and log to page
    const addPlayFragment = () => {
        nPauseTime = nPreviousTime;
        aFragments.push({
            start: Math.floor(nAdjustedPlayTime),
            end: Math.floor(nPauseTime)
        });
        logToPage(aFragments[aFragments.length - 1]);
    };

    // calculate view time from unique fragments and print to page
    const calculateUVT = (sInputFragments) => {

        checkTextboxForFragments(sInputFragments);

        let count = 0;
        const aMergedFragments = sortAndMergeFragments(aFragments);
        // calculate total view time
        const nUVT = aMergedFragments.forEach(oFrag => {
            count += (oFrag.end - oFrag.start);
        });
        // log items to page:
        logToPage('<br /> <strong>Unique Fragments:<strong>');
        logToPage(aMergedFragments);
        logToPage(`<br /> <strong>Unique View Time: ${count}ms<strong>`);
    }

    // public methods:
    return {
        calculateUVT: calculateUVT,
        updateTimes: updateTimes,
        addPlayFragment: addPlayFragment,
        timeUpdate: timeUpdate
    }

})();


$(document).ready(function(){
    // video player element:
    const ePlayer = document.querySelector('#video');

    // video player event hooks:
    ePlayer.onplay = function (e) {
        myModule.updateTimes(this.currentTime);
    };
    ePlayer.ontimeupdate = function(e) {
        myModule.timeUpdate(this.currentTime);
    };
    ePlayer.onpause = function (e) {
        myModule.addPlayFragment();
    };

    // Jquery to show/hide input field
    $("#showbtn").click(function(){
        $("#myCollapsible").collapse('toggle');
    });

    // Jquery to trigger calculation of UVT
    $("#calculate").click(function(){
        const eInputBox = document.querySelector('#inputbox');
        const sInputFragments = $(eInputBox).val();
        myModule.calculateUVT(sInputFragments);
    });
});
import {ADD_NEW_DATE, COMPLETE_TIME_SLOT, COMPLETE_ALL} from '../constants/ActionTypes'

const initialState = [
    {
        date: '',
        jobtime: [],
        completed: false,
        id: 0
    }
]

/** 
 *  handle the actions on a new date and a new time slot
 */
export default function timesheet(state = initialState, action) {
    switch (action.type) {
        
        // on a new date
        case ADD_NEW_DATE:
            return [
                {
                    id: state.reduce((maxId, timesheet) => Math.max(timesheet.id, maxId), -1) + 1,
                    completed: false,
                    date: action.date,
                    jobtime: []
                },
                ...state
            ]

        // on a job item saved within a time solt
        case COMPLETE_TIME_SLOT:
           return state.map(timesheet =>
                timesheet.id === action.id ?
                    { ...timesheet, jobtime: action.jobtime } :
                    timesheet
            )
        
        default:
            return state
    }
}
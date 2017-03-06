import { ADD_NEW_TIME_SLOT, SAVE_JOB_ITEM } from '../constants/ActionTypes'

const initialNewTimeSlotState = [
    {
        timeSlot: '',
        jobName: '',
        jobTime: '',
        totalJobTime: 0,
        completed: false,
        index: 0
    }
]

/** 
 * handle the actions in a new time slot
 */
export default function timeslot(state = initialNewTimeSlotState, action) {
    switch (action.type) {

        case ADD_NEW_TIME_SLOT: 
            return [
                {
                    timeSlot: action.timeslot,
                    index: state.reduce((maxIndex, timeSlot) => Math.max(timeSlot.index, maxIndex), -1) + 1,
                    jobName: '',
                    jobTime: '',
                    completed: false,
                    totalJobTime: 0,
                },
                ... state
            ]
        
        case SAVE_JOB_ITEM:
            return state.map(timeSlot =>
                todo.id === action.id ?
                    { ...todo, text: action.text } :
                    todo
            )
    }
}
import Grandpa from "../../questions/drag-drop/Family member - Grandpa.png"
import Dad from "../../questions/drag-drop/Family member - Dad.png"
import Daughter from "../../questions/drag-drop/Family member - Daughter.png"
import Grandma from "../../questions/drag-drop/Family member - Grandma.png"
import Mom from "../../questions/drag-drop/Family member - Mom.png"
import Son from "../../questions/drag-drop/Family member - Son.png"

const initialState = {
   familyMembers: {
      // Original positions of family members
      availableMembers: [
         { id: 1, name: 'Grandpa', imgSrc: Grandpa, position: 'top' },
         { id: 2, name: 'Son', imgSrc: Son, position: 'top' },
         { id: 3, name: 'Mom', imgSrc: Mom, position: 'top' },
         { id: 4, name: 'Grandma', imgSrc: Grandma, position: 'top' },
         { id: 5, name: 'Daughter', imgSrc: Daughter, position: 'top' },
         { id: 6, name: 'Dad', imgSrc: Dad, position: 'top' }
      ],
      // Slots on the tree to drag to
      treeSlots: {
         grandpa: null,
         grandma: null,
         mom: null,
         dad: null,
         son: null,
         daughter: null
      }
   }
};

function familyTreeReducer(state = initialState, action) {
   switch (action.type) {
      case 'DROP_MEMBER':
         return {
            ...state,
            familyMembers: {
               ...state.familyMembers,
               treeSlots: {
                  ...state.familyMembers.treeSlots,
                  [action.payload.slot]: action.payload.member
               }
            }
         };
      case 'REMOVE_MEMBER':
         return {
            ...state,
            familyMembers: {
               ...state.familyMembers,
               treeSlots: {
                  ...state.familyMembers.treeSlots,
                  [action.payload.slot]: null
               }
            }
         };
      default:
         return state;
   }
}

export default familyTreeReducer
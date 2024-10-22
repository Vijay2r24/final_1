// import React,{ useState } from 'react';
// import { Switch } from '@headlessui/react';

// const StatusSwitch = ({ id, status, onStatusChange }) => {

// const getStatusState = (status) => ({
//   isDelivered: status === 'Delivered',
//   isCanceled: status === 'Canceled',
// });

// const [statusState, setStatusState] = useState(getStatusState(status));

// const handleChange = (enabled) => {
//   let newStatus;

//   if (statusState.isCanceled) {
//     newStatus = 'Pending';
//   } else if (statusState.isDelivered) {
//     newStatus = 'Pending';
//   } else {
//     newStatus = 'Delivered';
//   }

//   setStatusState(getStatusState(newStatus));
//   onStatusChange(id, newStatus);
// };
// React.useEffect(() => {
//   setStatusState(getStatusState(status));
// }, [status]);

// return (
//   <div className="flex items-center space-x-3">
//     <Switch
//       checked={statusState.isDelivered}
//       onChange={handleChange}
//       disabled={statusState.isCanceled}
//       className={`group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${
//         statusState.isDelivered
//           ? 'bg-green-600'
//           : statusState.isCanceled
//           ? 'bg-gray-400 cursor-not-allowed'
//           : 'bg-red-600'
//       }`}
//     >
//       <span className="sr-only">Change status</span>
//       <span
//         aria-hidden="true"
//         className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//           statusState.isDelivered ? 'translate-x-5' : 'translate-x-0'
//         }`}
//       />
//     </Switch>
//   </div>
// );
// };

// export default StatusSwitch;


import React,{ useState } from 'react';
import { Switch } from '@headlessui/react';

const StatusSwitch = ({ id, status, onStatusChange }) => {

const getStatusState = (status) => ({
  isDelivered: status === 'Delivered',
  isCanceled: status === 'Canceled',
});

const [statusState, setStatusState] = useState(getStatusState(status));

const handleChange = (enabled) => {
  let newStatus;

  if (statusState.isCanceled) {
    newStatus = 'Pending';
  } else if (statusState.isDelivered) {
    newStatus = 'Pending';
  } else {
    newStatus = 'Delivered';
  }

  setStatusState(getStatusState(newStatus));
  onStatusChange(id, newStatus);
};
React.useEffect(() => {
  setStatusState(getStatusState(status));
}, [status]);

return (
  <div className="flex items-center space-x-3">
    <Switch
      checked={statusState.isDelivered}
      onChange={handleChange}
      disabled={statusState.isCanceled}
      className={`group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${
        statusState.isDelivered
          ? 'bg-green-600'
          : statusState.isCanceled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-600'
      }`}
    >
      <span className="sr-only">Change status</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          statusState.isDelivered ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </Switch>
  </div>
);
};

export default StatusSwitch;

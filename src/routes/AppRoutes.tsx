import { Navigate, Route, Routes } from 'react-router-dom'

import { Review } from '../pages/Review'
import { StepOne } from '../pages/StepOne'
import { StepThree } from '../pages/StepThree'
import { StepTwo } from '../pages/StepTwo'
import { Success } from '../pages/Success'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/step-1" />} />
      <Route path="/step-1" element={<StepOne />} />
      <Route path="/step-2" element={<StepTwo />} />
      <Route path="/step-3" element={<StepThree />} />
      <Route path="/review" element={<Review />} />
      <Route path="/success" element={<Success />} />
      <Route path="*" element={<Navigate replace to="/step-1" />} />
    </Routes>
  )
}

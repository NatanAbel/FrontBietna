import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchDetailsPage } from "../store/houseDetails/thunks"
import { selectHouseDetail } from "../store/houseDetails/selectors"

function DetailsPage() {
    const house = useSelector(selectHouseDetail)
    const dispatch = useDispatch()
    const {houseId} = useParams()

    useEffect(()=>{
        dispatch(fetchDetailsPage(houseId))
    },[dispatch,houseId])

  return (
    <div className="details-container">
        
    </div>
  )
}

export default DetailsPage
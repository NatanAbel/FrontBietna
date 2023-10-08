export const selecthouses = (reduxState)=> reduxState.house

export const selectFavs = (reduxState)=>{
    const houses = reduxState.house.houses
    const favorites = reduxState.house.favorites
    //  mapping over favorites array which is id's and find till it matches to house id
    const matchFavs = favorites.map(favId => 
        houses.find(house => house.id === favId)
        )
        // console.log("favorites......", favorites)

    return matchFavs

}
import Layout from "@/components/Helper/Layout"
import AllProductsData from "@/components/Home/AllProductsData"
import NoDataMessage from "@/components/Home/NoDataMessage"
import Loading from "@/components/Utils/Loading"
import PaginationButton from "@/components/Utils/PaginationButton"
import { useGetAllProductsQuery } from "@/store/APIs/productApi"
import { amountOfDataToFetchActions } from "@/store/slices/amount-of-data-to-fetch-slice"
import "aos/dist/aos.css"
import { useDispatch, useSelector } from "react-redux"

const Home = () => {
  const initialDataLimit = useSelector((state) => state.amountOfDataToFetch.initialDataToFetch)
  const initialDataOffset = useSelector((state) => state.amountOfDataToFetch.initialDataOffset)
  const maxDataAvailable = useSelector((state) => state.amountOfDataToFetch.maximumData)
  const dispatch = useDispatch()

  const {
    currentData: allProductsData,
    isLaoding: allProductsDataIsLoading,
    isSuccess: allProductsDataSuccess,
    isError: allProductsDataError,
    isFetching: allProductsDataIsFetching,
  } = useGetAllProductsQuery(
    { limit: initialDataLimit, offset: initialDataOffset },
    { refetchOnMountOrArgChange: true }
  )

  // Fetch next data whenever next button is clicked <PaginationButton /> component
  const fetchNextData = () => {
    dispatch(amountOfDataToFetchActions.maxDataFunction(allProductsData?.total))
    if (initialDataOffset === 0)
      return dispatch(amountOfDataToFetchActions.additionalDataOffsetFunction(initialDataOffset + initialDataLimit))
    dispatch(amountOfDataToFetchActions.additionalDataOffsetFunction(initialDataOffset))
  }

  // Fetch previous data whenever next button is clicked <PaginationButton /> component
  const fetchPreviousData = () => {
    dispatch(amountOfDataToFetchActions.maxDataFunction(allProductsData?.total))
    dispatch(amountOfDataToFetchActions.subtractDataOffsetFunction(initialDataOffset))
  }

  return (
    <Layout>
      {allProductsDataIsFetching && <Loading />}
      {!allProductsDataIsLoading && allProductsDataError && <NoDataMessage />}
      {!allProductsDataIsFetching && !allProductsDataError && (
        <>
          <AllProductsData allProductsData={allProductsData} />
          <PaginationButton
            totalAmountOfDataShowing={allProductsData?.data?.length}
            total={allProductsData?.total}
            fetchNextData={fetchNextData}
            fetchPreviousData={fetchPreviousData}
          />
        </>
      )}
    </Layout>
  )
}

export default Home


cmake_minimum_required(VERSION 3.10)

project(itkfiltering)

set(io_components ITKImageIO)
if(EMSCRIPTEN)
  set(io_components BridgeJavaScript)
endif()
find_package(ITK REQUIRED
  COMPONENTS ${io_components}
    ITKSmoothing
  )
include(${ITK_USE_FILE})

set(itkfiltering_SRCS itk_filtering.cxx)
if(EMSCRIPTEN)
  include(ITKBridgeJavaScript)
  web_add_executable(itkfiltering ${itkfiltering_SRCS})

else()
  add_executable(itkfiltering ${itkfiltering_SRCS})
endif()

target_link_libraries(itkfiltering ${ITK_LIBRARIES})


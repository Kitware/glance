
/*=========================================================================
 *
 *  Copyright Insight Software Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/

#include <string>
#include "itkImageFileReader.h"
#include "itkImageFileWriter.h"
#include "itkMedianImageFilter.h"
#include "itkCastImageFilter.h"

int median_filter( int argc, char * argv[] )
{
  if( argc < 5 )
    {
    std::cerr << "Usage: " << argv[0] << " medianfilter <inputImage> <outputImage> <radius>" << std::endl;
    return EXIT_FAILURE;
    }

  const char * inputImageFile = argv[2];
  const char * outputImageFile = argv[3];
  unsigned int radius = atoi( argv[4] );

  using PixelType = float;
  constexpr unsigned int Dimension = 3;
  using ImageType = itk::Image< PixelType, Dimension >;

  using ReaderType = itk::ImageFileReader< ImageType >;
  auto reader = ReaderType::New();
  reader->SetFileName( inputImageFile );

  using SmoothingFilterType = itk::MedianImageFilter< ImageType, ImageType >;
  auto smoother = SmoothingFilterType::New();
  smoother->SetInput( reader->GetOutput() );
  smoother->SetRadius( radius );

  using WriterType = itk::ImageFileWriter< ImageType>;
  auto writer = WriterType::New();
  writer->SetInput( smoother->GetOutput() );
  writer->SetFileName( outputImageFile );

  try
    {
    writer->Update();
    }
  catch( itk::ExceptionObject & error )
    {
    std::cerr << "Error: " << error << std::endl;
    return EXIT_FAILURE;
    }

  return EXIT_SUCCESS;
}

void print_help( char * argv[] )
{
  std::cerr << "Usage: " << argv[0] << " <command> [args...]" << std::endl;
  std::cerr << "Available commands: medianfilter" << std::endl;
}

int main( int argc, char * argv[] )
{
  if( argc < 2 )
    {
    print_help( argv );
    return EXIT_FAILURE;
    }

  std::string command( argv[1] );
  if( 0 == command.compare("medianfilter") )
    {
    return median_filter( argc, argv );
    }
  else
    {
    print_help( argv );
    return EXIT_FAILURE;
    }
}

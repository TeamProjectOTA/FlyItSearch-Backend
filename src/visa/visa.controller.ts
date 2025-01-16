import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { VisaService } from './visa.service';
import { VisaAllDto } from './dto/visa-all.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Visa } from './entity/visa.entity';
@ApiTags("Visa")
@Controller('visa')
export class VisaController {
  constructor(private readonly visaService: VisaService) { 
  }

  @Post("/createVisa")
  create(@Body() visaAllDto: VisaAllDto) {
    return this.visaService.createVisaAll(visaAllDto);
  }

  @Get("/findAllVisa")
  @ApiResponse({
    status: 200,
    description: 'successfull',
    content: {
      'application/json': {
        example: {
          data: [
            {
              departureCountry: "Bangladesh",
              arrivalCountry: "United States",
              visaCategory: "Tourist",
              visaType: "Single-entry",
              cost: "200.00",
              durationCosts: [
                {
                  cost: "1500.00",
                  entry: "Consulate",
                  duration: "30 days",
                  maximumStay: "90 days",
                  processingTime: "10 business days",
                  interview: "Mandatory",
                  embassyFee: "100 USD",
                  agentFee: "50 USD",
                  serviceCharge: "20 USD",
                  processingFee: "30 USD"
                }
              ],
              visaRequiredDocuments: {
                profession: "Software Engineer",
                documents: "Required document",
                exceptionalCase: "If the applicant has no recent work experience, they may submit a self-declaration letter.",
                note: "Documents must be in English or translated to English."
              }
            }
          ],
          total: 20,
          page: "1",
          limit: 1,
          totalPages: 20
        }
      }
    }
  })
  
  async findAll(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10 
  ) {
    
    limit = Math.min(limit, 100);
    return this.visaService.findAll(page, limit);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.visaService.findOne(id);
  }
  @Delete('/deleteVisa/:id')
  delete(@Param('id') id: number) {
    return this.visaService.deleteVisa(id);
  }

  @Patch('/updateVisa/:id')
  @ApiOperation({ summary: 'Partially update Visa and related entities' })
  @ApiResponse({
    status: 200,
    description: 'Visa updated successfully',
    type: Visa,
    example: {
      'application/json': {
        id: 19,
        departureCountry: "India",
        arrivalCountry: "United States",
        visaCategory: "Tourist",
        visaType: "Single-entry",
        cost: 200.00,
        createdAt: "2025-01-16T08:19:33.000Z",
        updatedAt: "2025-01-16T08:19:33.000Z",
        durationCosts: [
          {
            id: 29,
            cost: 1500.00,
            entry: "Consulate",
            duration: "30 days",
            maximumStay: "90 days",
            processingTime: "10 business days",
            interview: "Mandatory",
            embassyFee: "100 USD",
            agentFee: "50 USD",
            serviceCharge: "20 USD",
            processingFee: "30 USD"
          }
        ],
        visaRequiredDocuments: {
          id: 18,
          profession: "Software Engineer",
          documents: "Required document",
          exceptionalCase: "If the applicant has no recent work experience, they may submit a self-declaration letter.",
          note: "Documents must be in English or translated to English.",
          createdAt: "2025-01-16T08:19:33.000Z",
          updatedAt: "2025-01-16T08:19:33.000Z"
        }
      }
    }
  })
  
  @ApiResponse({ status: 404, description: 'Visa not found' })
  async updateVisa(
    @Param('id', ParseIntPipe) id: number,
    @Body() visaAllDto: VisaAllDto,
  ): Promise<Visa> {
    try {
      const updatedVisa = await this.visaService.updateVisaAll(id, visaAllDto);
      return updatedVisa;
    } catch (error) {
      throw new Error(`Error updating visa: ${error.message}`);
    }
  }
}

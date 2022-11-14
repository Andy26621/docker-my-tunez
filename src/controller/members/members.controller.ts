import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MembersDto } from 'src/dto/members.dto';
import { newMemberDto } from 'src/dto/new-member.dto';
import { MembersService } from 'src/service/members/members.service';

@Controller('member')
export class MembersController {
  constructor(private memberService: MembersService) {}

  @Post()
  saveMember(@Body() memberData: MembersDto) {
    return this.memberService.saveMember(memberData, memberData.artistName);
  }

  @Get()
  public async getMemberCount(@Query() query) {
    const artistId = await this.memberService.getArtistId(query.value);
    return await this.memberService.getMemberCount(artistId);
  }

  @Put()
  updateMember(@Body() memberData: newMemberDto) {
    return this.memberService.updateMember(memberData);
  }

  @Delete(':name')
  public async deleteMember(@Param('name') name: string) {
    return await this.memberService.deleteMember(name);
  }
}

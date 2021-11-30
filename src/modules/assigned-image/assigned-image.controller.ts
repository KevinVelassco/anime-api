import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AssignedImage } from './assigned-image.entity';
import { AssignedImageService } from './assigned-image.service';
import { AssignImageToCharacterInput } from './dto/assign-image-to-character-input.dto';

@ApiTags('assigned-image')
@Controller('assigned-image')
export class AssignedImageController {
  constructor(private readonly assignedImageService: AssignedImageService) {}

  @Post()
  create(
    @Body() assignImageToCharacterInput: AssignImageToCharacterInput
  ): Promise<AssignedImage> {
    return this.assignedImageService.assignImageToCharacter(
      assignImageToCharacterInput
    );
  }
}

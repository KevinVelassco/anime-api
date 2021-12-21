import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AssignedImage } from './assigned-image.entity';
import { AssignedImageService } from './assigned-image.service';
import { AssignImageToCharacterInput } from './dto/assign-image-to-character-input.dto';
import { RemoveAssignedImageFromCharacterInput } from './dto/remove-assigned-image-from-character-input.dto';
import { Admin } from '../../common/decorators/admin.decorator';

@ApiTags('assigned-image')
@Controller('assigned-image')
export class AssignedImageController {
  constructor(private readonly assignedImageService: AssignedImageService) {}

  @Post()
  assignImageToCharacter(
    @Body() assignImageToCharacterInput: AssignImageToCharacterInput
  ): Promise<AssignedImage> {
    return this.assignedImageService.assignImageToCharacter(
      assignImageToCharacterInput
    );
  }

  @Admin()
  @Delete()
  removeAssignedImageFromCharacter(
    @Body()
    removeAssignedImageFromCharacterInput: RemoveAssignedImageFromCharacterInput
  ): Promise<AssignedImage> {
    return this.assignedImageService.removeAssignedImageFromCharacter(
      removeAssignedImageFromCharacterInput
    );
  }
}

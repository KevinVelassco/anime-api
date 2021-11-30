import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CharacterService } from '../character/character.service';
import { ImageService } from '../image/image.service';
import { AssignedImage } from './assigned-image.entity';
import { AssignImageToCharacterInput } from './dto/assign-image-to-character-input.dto';
import { RemoveAssignedImageFromCharacterInput } from './dto/remove-assigned-image-from-character-input.dto';

@Injectable()
export class AssignedImageService {
  constructor(
    @InjectRepository(AssignedImage)
    private readonly assignedImageRepository: Repository<AssignedImage>,
    private readonly characterService: CharacterService,
    private readonly imageService: ImageService
  ) {}

  public async assignImageToCharacter(
    assignImageToCharacterInput: AssignImageToCharacterInput
  ): Promise<AssignedImage> {
    const { characterUid } = assignImageToCharacterInput;

    const character = await this.characterService.findOne({
      uid: characterUid,
      checkIfExists: true
    });

    const { imageUid } = assignImageToCharacterInput;

    const image = await this.imageService.findOne({
      uid: imageUid,
      checkIfExists: true
    });

    const created = this.assignedImageRepository.create({
      character,
      image
    });

    const existing = await this.assignedImageRepository.findOne({
      character,
      image
    });

    if (existing) {
      throw new ConflictException(
        'the image is already assigned to the character'
      );
    }

    const saved = await this.assignedImageRepository.save(created);

    return saved;
  }

  public async removeAssignedImageFromCharacter(
    removeAssignedImageFromCharacterInput: RemoveAssignedImageFromCharacterInput
  ): Promise<AssignedImage> {
    const { characterUid } = removeAssignedImageFromCharacterInput;

    const character = await this.characterService.findOne({
      uid: characterUid,
      checkIfExists: true
    });

    const { imageUid } = removeAssignedImageFromCharacterInput;

    const image = await this.imageService.findOne({
      uid: imageUid,
      checkIfExists: true
    });

    const existing = await this.assignedImageRepository.findOne({
      character,
      image
    });

    if (!existing) {
      throw new NotFoundException(
        `the image is not assigned to the character with uuid ${character.uid}.`
      );
    }

    const saved = await this.assignedImageRepository.remove(existing);

    return saved;
  }
}

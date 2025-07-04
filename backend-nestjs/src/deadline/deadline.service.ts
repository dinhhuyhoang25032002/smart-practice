import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { DEADLINE_MODEL, Deadline } from 'src/schema/deadline.schema';
import { Model } from 'mongoose';
import { DealineDto } from 'src/deadline/class/Dealine.dto';

@Injectable()
export class DeadlineService {
    constructor(
        @InjectModel(DEADLINE_MODEL)
        private readonly deadlineModel: Model<Deadline> & SoftDeleteModel<Deadline>,
    ) { }

    async handleCreateDeadline(data: DealineDto, userId: string) {
        const { productionId, productionType } = data;
        const deadline = await this.deadlineModel.findOne({
            userId,
            productionId, productionType
        })
        if (!deadline) {
            const newDeadline = await new this.deadlineModel({
                userId,
                productionId,
                productionType,
            }).save({ validateBeforeSave: true });
            return newDeadline;
        }
        return new BadRequestException()
    }
}

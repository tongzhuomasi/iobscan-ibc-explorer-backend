import * as mongoose from 'mongoose';
import { IbcTaskRecordType } from '../types/schemaTypes/ibc_task_record.interface';

export const IbcTaskRecordSchema = new mongoose.Schema({
  _id: String,
  task_name: String,
  status: {
    type: String,
    default: 'open',
  },
  height: Number,
  create_at: String,
  update_at: String,
});

IbcTaskRecordSchema.index({ task_name: 1 }, { unique: true });

IbcTaskRecordSchema.statics = {
  // 查
  async findAll(): Promise<IbcTaskRecordType> {
    const result = await this.find();
    return result;
  },
  async findTaskRecord(task_id, cb): Promise<IbcTaskRecordType> {
    const result = await this.findOne(
      { task_name: `sync_${task_id}_transfer` },
      { _id: 0 },
      cb,
    );
    return result;
  },
  // 改
  async updateTaskRecord(taskRecord: IbcTaskRecordType, cb) {
    const { task_name } = taskRecord;
    const options = { upsert: true, new: false, setDefaultsOnInsert: true };
    return await this.findOneAndUpdate({ task_name }, taskRecord, options, cb);
  },
  // 增
  async insertManyTaskRecord(taskRecords: IbcTaskRecordType[], cb) {
    return await this.insertMany(taskRecords, { ordered: false }, cb);
  },
};

import { Enrollment } from '@prisma/client';
import { prisma } from '@/config';

async function findAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function findById(id: number): Promise<Enrollment> {
  return prisma.enrollment.findUnique({
    where: { id },
  });
}

async function findByUserId(userId: number): Promise<Enrollment> {
  return prisma.enrollment.findUnique({
    where: { userId },
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, 'userId'>;

const enrollmentRepository = {
  findAddressByUserId,
  findById,
  findByUserId,
  upsert,
};

export default enrollmentRepository;

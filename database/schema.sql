CREATE TYPE upload_status AS ENUM (
    'INITIATED',
    'UPLOADING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE buckets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL,
    name VARCHAR(63) NOT NULL,
    region  VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(), 

        CONSTRAINT uniq_owner_bucket UNIQUE (owner_id, name),
        CONSTRAINT fk_bucket_owner
            FOREIGN KEY (owner_id)
            REFERENCES users(id)
            ON DELETE CASCADE
);

CREATE TABLE objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    object_key VARCHAR(1024) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT uniq_object_key UNIQUE (bucket_id, object_key),
        CONSTRAINT fk_object_bucket
            FOREIGN KEY (bucket_id)
            REFERENCES buckets(id)
            ON DELETE CASCADE,

        CONSTRAINT fk_object_owner
            FOREIGN KEY (owner_id)
            REFERENCES users(id)
            ON DELETE CASCADE
);

CREATE TABLE object_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum VARCHAR(64),
    storage_path VARCHAR(1024) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT uniq_object_version UNIQUE (object_id, version_number),
        CONSTRAINT fk_object_version 
            FOREIGN KEY (object_id)
            REFERENCES objects(id)
            ON DELETE CASCADE
);

CREATE TABLE uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_id UUID NOT NULL,
    initiated_by_user_id UUID NOT NULL,
    state upload_status NOT NULL DEFAULT 'INITIATED',
    total_chunks INTEGER NOT NULL,
    chunk_size BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,

        CONSTRAINT fk_upload_object
            FOREIGN KEY (object_id)
            REFERENCES objects(id)
            ON DELETE CASCADE,

        CONSTRAINT fk_upload_user
            FOREIGN KEY (initiated_by_user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
);

CREATE TABLE upload_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    upload_id UUID NOT NULL,
    chunk_index INTEGER NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT uniq_upload_chunk UNIQUE (upload_id, chunk_index),
        CONSTRAINT fk_upload_id
            FOREIGN KEY (upload_id)
            REFERENCES uploads(id)
            ON DELETE CASCADE 
)
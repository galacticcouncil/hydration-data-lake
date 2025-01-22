#!/bin/sh

set -e
sqd migration:apply
sqd process:prod
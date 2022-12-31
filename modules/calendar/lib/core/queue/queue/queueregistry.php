<?php

namespace Bitrix\Calendar\Core\Queue\Queue;


class QueueRegistry
{
	public const QUEUE_LIST = [
		'EventDelayedSync' => 1,
		'UpdateDepartmentStructure' => 2,
		'UpdateSocialGroupStructure' => 3,
		'Example' => 4,
	];

	public const ROUTING_TO_QUEUES = [
		'calendar:update_meeting_status' => [
			'EventDelayedSync'
		],
	];

	/**
	 * @param int $id
	 *
	 * @return string|null
	 */
	public static function getNameById(int $id): ?string
	{
		if ($key = array_search($id, self::QUEUE_LIST))
		{
			return $key;
		}

		return null;
	}

	/**
	 * @param string $name
	 *
	 * @return int|null
	 */
	public static function getIdByName(string $name): ?int
	{
		return self::QUEUE_LIST[$name] ?? null;
	}
}